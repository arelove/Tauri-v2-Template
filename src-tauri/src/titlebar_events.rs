use tauri::{AppHandle, Window};
use tauri::Emitter;
use tauri::Manager;

#[tauri::command]
pub fn minimize_window(app: AppHandle, window: Window) {
    if let Err(e) = window.minimize() {
        app.emit("log", format!("Failed to minimize window: {}", e)).unwrap();
    }
}

#[tauri::command]
pub fn toggle_maximize(app: AppHandle, window: Window) {
    if let Ok(is_maximized) = window.is_maximized() {
        if is_maximized {
            if let Err(e) = window.unmaximize() {
                app.emit("log", format!("Failed to unmaximize window: {}", e)).unwrap();
            }
        } else {
            if let Err(e) = window.maximize() {
                app.emit("log", format!("Failed to maximize window: {}", e)).unwrap();
            }
        }
    }
}

#[tauri::command]

pub fn close_window(app: AppHandle, window: Window) {
    app.remove_tray_by_id("main").expect("Failed to remove tray on close");
    if let Err(e) = window.close() {
        app.emit("log", format!("Failed to close window: {}", e)).unwrap();
    }
    app.exit(0); // Завершаем приложение полностью
}

#[tauri::command]
pub fn hide_to_tray(app: AppHandle, window: Window) {
    if let Err(e) = window.hide() {
        app.emit("log", format!("Failed to hide window to tray: {}", e)).unwrap();
    }
}

#[tauri::command]
pub fn show_from_tray(app: AppHandle, window: Window) {
    if let Err(e) = window.show() {
        app.emit("log", format!("Failed to show window from tray: {}", e)).unwrap();
    }
    if let Err(e) = window.set_focus() {
        app.emit("log", format!("Failed to set focus on window: {}", e)).unwrap();
    }
}

#[tauri::command]
pub fn toggle_fullscreen(app: AppHandle, window: Window) {
    if let Ok(is_fullscreen) = window.is_fullscreen() {
        if is_fullscreen {
            if let Err(e) = window.set_fullscreen(false) {
                app.emit("log", format!("Failed to exit fullscreen: {}", e)).unwrap();
            }
        } else {
            if let Err(e) = window.set_fullscreen(true) {
                app.emit("log", format!("Failed to enter fullscreen: {}", e)).unwrap();
            }
        }
    }
}

#[tauri::command]
pub fn set_mini_size(app: AppHandle, window: Window) {
    if let Err(e) = window.set_size(tauri::PhysicalSize::new(593, 370)) {
        app.emit("log", format!("Failed to set mini size: {}", e)).unwrap();
    }
}

#[tauri::command]
pub fn log_message(app: AppHandle, message: String) {
    if let Err(e) = app.emit("log", &message) {
        eprintln!("Failed to emit log: {}", e);
    }
}

#[tauri::command]
pub fn refresh_app(app: AppHandle, _window: Window) {
    // Пример команды для перезагрузки (может быть заменена на вашу логику)
    let webview = app.get_webview_window("main").unwrap();
    if let Err(e) = webview.eval("window.location.reload()") {
        app.emit("log", format!("Failed to refresh app: {}", e)).unwrap();
    }
}