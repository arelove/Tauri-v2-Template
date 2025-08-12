use serde::{Deserialize, Serialize};
use network_interface::{NetworkInterface, NetworkInterfaceConfig};
use reqwest::Client;

#[derive(Serialize, Deserialize)]
pub struct NetworkDetails {
    pub online: bool,
    pub interfaces: Vec<NetworkInterfaceInfo>,
    pub internet_accessible: bool,
    pub ssid: Option<String>,
    pub signal_strength: Option<i32>,
}

#[derive(Serialize, Deserialize)]
pub struct NetworkInterfaceInfo {
    pub name: String,
    pub ip: String,
}

#[tauri::command]
pub async fn get_network_details() -> Result<NetworkDetails, String> {
    // Get network interfaces using network-interface crate
    let interfaces_result = NetworkInterface::show();
    let interfaces: Vec<_> = match interfaces_result {
        Ok(interfaces) => interfaces
            .into_iter()
            .map(|iface| {
                // Select the first IPv4 address or join all addresses
                let ip = if iface.addr.is_empty() {
                    "N/A".to_string()
                } else {
                    iface
                        .addr
                        .iter()
                        .filter(|addr| addr.ip().is_ipv4()) // Prefer IPv4
                        .map(|addr| addr.ip().to_string())
                        .collect::<Vec<String>>()
                        .join(", ") // Join multiple IPs with commas
                };
                NetworkInterfaceInfo {
                    name: iface.name,
                    ip,
                }
            })
            .collect(),
        Err(e) => return Err(format!("Failed to get network interfaces: {}", e)),
    };

    // Check internet accessibility with an HTTP ping
    let client = Client::new();
    let internet_accessible = client
        .get("https://www.google.com")
        .send()
        .await
        .is_ok();

    // Attempt to get Wi-Fi SSID and signal strength (platform-specific)
    let (ssid, signal_strength) = if cfg!(target_os = "macos") {
        match std::process::Command::new("airport")
            .arg("-I")
            .output()
        {
            Ok(output) => {
                let output_str = String::from_utf8_lossy(&output.stdout);
                let ssid = output_str
                    .lines()
                    .find(|line| line.contains("SSID:"))
                    .map(|line| line.replace("SSID:", "").trim().to_string());
                let signal = output_str
                    .lines()
                    .find(|line| line.contains("agrCtlRSSI:"))
                    .and_then(|line| line.replace("agrCtlRSSI:", "").trim().parse::<i32>().ok());
                (ssid, signal)
            }
            Err(_) => (None, None),
        }
    } else if cfg!(target_os = "linux") {
        match std::process::Command::new("iwctl")
            .args(&["station", "wlan0", "show"])
            .output()
        {
            Ok(output) => {
                let output_str = String::from_utf8_lossy(&output.stdout);
                let ssid = output_str
                    .lines()
                    .find(|line| line.contains("Connected network"))
                    .map(|line| line.replace("Connected network", "").trim().to_string());
                let signal = output_str
                    .lines()
                    .find(|line| line.contains("RSSI"))
                    .and_then(|line| line.replace("RSSI", "").trim().parse::<i32>().ok());
                (ssid, signal)
            }
            Err(_) => (None, None),
        }
    } else if cfg!(target_os = "windows") {
        match std::process::Command::new("netsh")
            .args(&["wlan", "show", "interfaces"])
            .output()
        {
            Ok(output) => {
                let output_str = String::from_utf8_lossy(&output.stdout);
                let ssid = output_str
                    .lines()
                    .find(|line| line.contains("SSID"))
                    .and_then(|line| line.split(':').nth(1))
                    .map(|s| s.trim().to_string());
                let signal = output_str
                    .lines()
                    .find(|line| line.contains("Signal"))
                    .and_then(|line| line.split(':').nth(1))
                    .and_then(|s| s.trim().replace("%", "").parse::<i32>().ok());
                (ssid, signal)
            }
            Err(_) => (None, None),
        }
    } else {
        (None, None)
    };

    Ok(NetworkDetails {
        online: !interfaces.is_empty(),
        interfaces,
        internet_accessible,
        ssid,
        signal_strength,
    })
}