mod tray;
use crate::tray::{setup_system_tray, setup_window_event_handler};

mod titlebar_events;
mod network;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .plugin(tauri_plugin_opener::Builder::default().build());

    #[cfg(debug_assertions)]
    {
        builder = builder.plugin(tauri_plugin_devtools::init());
    }

    builder
        .setup(|app| {
            setup_system_tray(app)?;
            setup_window_event_handler(app)?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            titlebar_events::minimize_window,
            titlebar_events::toggle_maximize,
            titlebar_events::close_window,
            titlebar_events::toggle_fullscreen,
            titlebar_events::set_mini_size,
            titlebar_events::log_message,
            titlebar_events::refresh_app,
            titlebar_events::hide_to_tray,
            titlebar_events::show_from_tray,
            network::get_network_details,
            
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
