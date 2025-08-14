use tauri::{
    Manager, tray::TrayIconBuilder, 
    menu::{Menu, MenuItem},
};

// Настройка системного трея
pub fn setup_system_tray(app: &tauri::App) -> tauri::Result<()> {
    if app.tray_by_id("main").is_some() {
        app.remove_tray_by_id("main").expect("Failed to remove existing tray");
    }

    let open = MenuItem::with_id(app, "open", "Open", true, None::<&str>)?;
    let minimize = MenuItem::with_id(app, "minimize", "Minimize", true, None::<&str>)?;
    let maximize = MenuItem::with_id(app, "maximize", "Maximize", true, None::<&str>)?;
    let quit = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
    let menu = Menu::with_items(app, &[&open, &minimize, &maximize, &quit])?;

    let _tray = TrayIconBuilder::with_id("main")
        .menu(&menu)
        .icon(app.default_window_icon().unwrap().clone())
        .tooltip("Tauri Template")
        .on_menu_event(|app, event| {
            let window = app.get_webview_window("main").unwrap();
            match event.id.as_ref() {
                "open" => {
                    let _ = window.show();
                    let _ = window.set_focus();
                }
                "minimize" => {
                    let _ = window.minimize();
                }
                "maximize" => {
                    let _ = window.maximize();
                }
                "quit" => {
                    app.remove_tray_by_id("main").expect("Failed to remove tray on quit");
                    app.exit(0);
                }
                _ => {}
            }
        })
        .build(app)?;

    Ok(())
}

// Настройка обработчика событий окна
pub fn setup_window_event_handler(app: &tauri::App) -> tauri::Result<()> {
    let window = app.get_webview_window("main").unwrap();
    window.clone().on_window_event(move |event| {
        if let tauri::WindowEvent::CloseRequested { api, .. } = event {
            api.prevent_close();
            if let Err(e) = window.hide() {
                eprintln!("Failed to hide window: {}", e);
            }
        }
    });
    Ok(())
}