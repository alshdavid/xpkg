use anyhow::Context;
use std::fs;
use std::io;
use std::path::Path;
use std::path::PathBuf;
use zip::ZipArchive;

use crate::platform;

pub fn decompress_zip(target: &Path, output: &Path, strip_components: Option<usize>) -> anyhow::Result<()> {
    let target = &platform::cmd_utils::resolve_path(target.to_str().unwrap())?;
    
    // Validate that the archive exists
    if !target.exists() {
        anyhow::bail!("Archive does not exist: {:?}", target);
    }
    
    // Create output directory if it doesn't exist
    fs::create_dir_all(output)
        .context(format!("Failed to create output directory: {:?}", output))?;
    
    // Open the zip file
    let file = fs::File::open(target)
        .context(format!("Failed to open archive: {:?}", target))?;
    
    // Create zip archive reader
    let mut archive = ZipArchive::new(file)
        .context(format!("Failed to read zip archive: {:?}", target))?;
    
    let strip_count = strip_components.unwrap_or(0);
    
    // Extract each file in the archive
    for i in 0..archive.len() {
        let mut file = archive.by_index(i)
            .context(format!("Failed to access zip entry {}", i))?;
        
        let original_path = match file.enclosed_name() {
            Some(path) => path.to_path_buf(),
            None => continue, // Skip entries with unsafe paths
        };
        
        // Strip components if requested
        let stripped_path = if strip_count > 0 {
            let components: Vec<_> = original_path.components().collect();
            
            // Skip entries that don't have enough components
            if components.len() <= strip_count {
                continue;
            }
            
            // Build new path without the first n components
            let new_path: PathBuf = components[strip_count..].iter().collect();
            
            // Skip if the resulting path is empty
            if new_path.as_os_str().is_empty() {
                continue;
            }
            
            new_path
        } else {
            original_path
        };
        
        let outpath = output.join(&stripped_path);
        
        if file.name().ends_with('/') {
            // Create directory
            fs::create_dir_all(&outpath)
                .context(format!("Failed to create directory: {:?}", outpath))?;
        } else {
            // Create parent directories if needed
            if let Some(parent) = outpath.parent() {
                fs::create_dir_all(parent)
                    .context(format!("Failed to create parent directory: {:?}", parent))?;
            }
            
            // Extract file
            let mut outfile = fs::File::create(&outpath)
                .context(format!("Failed to create file: {:?}", outpath))?;
            io::copy(&mut file, &mut outfile)
                .context(format!("Failed to extract file: {:?}", outpath))?;
        }
        
        // Set permissions on Unix systems
        #[cfg(unix)]
        {
            use std::os::unix::fs::PermissionsExt;
            if let Some(mode) = file.unix_mode() {
                fs::set_permissions(&outpath, fs::Permissions::from_mode(mode))
                    .context(format!("Failed to set permissions: {:?}", outpath))?;
            }
        }
    }
    
    Ok(())
}