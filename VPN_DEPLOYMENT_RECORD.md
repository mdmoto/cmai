# Chiang Mai AI Center - VPN 部署与管理记录 (VPN Deployment & Admin Record)

本文档记录了为清迈 AI 中心及全球远程团队部署的 VPN 网络架构、管理面板地址、以及员工使用配置指南。

---

## 1. 方案架构概述 (Architecture Overview)

为了兼顾**国内连接稳定性 (防封锁)** 和 **苹果手机免商店下载 (简易度)**，本项目采用了**混合协议部署方案**：

*   **iOS 苹果手机/Mac 电脑**：采用系统自带的 **L2TP 协议**。员工无需在 App Store 切换海外 ID 或是安装任何第三方 App，直接双击安装描述文件即可直接在系统“设置”中完成配置。
*   **Windows / Android / 生产力电脑**：采用高性能的 **VLESS-Reality 协议**。数据流量完美伪装成正常的苹果官网 HTTPS 访问，防封锁能力极强，网速最快，适合日常高频办公。

---

## 2. 管理面板与连接门户汇总 (Portals & Credentials)

| 页面/服务名称 | 访问地址 (URL) | 登录凭证 / 密钥 | 备注说明 |
| :--- | :--- | :--- | :--- |
| **员工 VPN 配置门户** | [lazzor.com/vpn](https://lazzor.com/vpn) | 公开访问 | 员工在此页面下载苹果配置文件，或复制 VLESS 密钥 |
| **iOS 描述文件直连** | [lazzor.com/vpnclient.mobileconfig](https://lazzor.com/vpnclient.mobileconfig) | 公开下载 | 苹果手机 Safari 浏览器打开此链接将直接触发安装 |
| **VPN 可视化管理后台** | `http://52.220.132.229:2055` | 密码：`Cmai@Secure2026` | 管理 L2TP / L2TP **个人账号密码** 的新增与删除 |
| **3x-ui 代理管理后台** | `http://52.220.132.229:2053/cmai/` | 账号：`cmai_admin`<br>密码：`Cmai@Secure2026` | 管理 Windows/Android 端的 VLESS 节点及流量控制 |

---

## 3. 可视化用户管理指南 (Visual Admin Guide)

为了方便非技术行政人员 (如 HR) 进行日常账户管理，避免使用繁琐的服务器命令，可直接登录 `http://52.220.132.229:2055` 后台进行操作：

1.  **新增员工账号**：点击页面右上角 **“+ 新增用户 / Add User”**，输入员工英文/拼音用户名（如 `zhang_san`）及密码，点击确定即可。该账号将同时自动生效于 L2TP 和 L2TP 服务。
2.  **修改密码**：点击对应员工右侧的 **“修改 / Edit”**，直接重置新密码。
3.  **删除员工 (收回权限)**：员工离职时，点击对应行右侧的 **“删除 / Delete”**。点击后，该员工在所有设备上的 VPN 连接将瞬间断开且无法重新连接。

---

## 4. 安全与防账号共享机制 (Security & Anti-Sharing)

为防止员工私自将 VPN 账号分享给外部人员使用，系统配置了以下限制：

*   **L2TP 个人账号限制 (同号踢人)**：
    服务器已配置 `uniqueids=yes` 规则。同一个 VPN 账号如果尝试在第二台设备上连接，**第一台设备将被立刻强制踢下线**。员工之间无法同时共享同一个账号。
*   **VLESS (3x-ui) 账号限制**：
    在 `3x-ui` 后台创建用户时，请将 **“IP限制 (IP Limit)”** 设置为 **`1`**（或 `2`，允许该员工一台手机和一台电脑同时在线），超出限制的设备将被服务器拒绝连接。

---

## 5. 员工连接指南 (Client Configuration)

### 🍏 iOS (iPhone / iPad) 快速配置：
1.  在 iPhone 上使用 **Safari 浏览器** 打开 [lazzor.com/vpn](https://lazzor.com/vpn)。
2.  点击 **“下载并安装 iOS 描述文件”** 按钮。
3.  手机弹出“已下载描述文件”提示，点击关闭。
4.  打开 iPhone 的 **设置** -> 在顶部找到并点击 **“已下载描述文件”**。
5.  点击右上角 **安装**，输入锁屏密码确认。
6.  系统会弹窗提示输入 VPN 凭证，依次输入管理员在面板中分配给该员工的 **用户名** 和 **密码** 即可。
7.  安装完成后，前往 **设置 -> VPN**，选中 `L2TP VPN` 并开启连接。

### 💻 Windows / Android / Mac (VLESS 加密连接)：
1.  在电脑/手机上下载并安装对应的客户端（软件下载链接已打包在 [lazzor.com/vpn](https://lazzor.com/vpn) 页面中）。
2.  点击配置门户页面中的 **“复制连接密钥”**。
3.  打开已下载的客户端软件，在空缺处按 `Ctrl+V` (Windows) 或 `Cmd+V` (Mac) 粘贴即可自动导入节点。
4.  点击启动连接。为了保证国内访问速度，软件的路由模式建议选择 **“绕过大陆 (Bypass Mainland China)”**。

---

## 6. 服务器防火墙放行端口清单 (Firewall Ports Configuration)

如遇服务器网络迁移或防火墙重置，必须在 AWS Lightsail 防火墙中放行以下端口以保障服务运转：

*   **TCP 80 & 443**：放行网站正常访问及 VLESS Reality 隧道流量 (Anywhere)。
*   **TCP 2053**：放行 `3x-ui` 管理页面。
*   **TCP 2055**：放行 `VPN Admin` 可视化管理面板。
*   **UDP 0 -> 65535 (All UDP)**：放行 L2TP / L2TP 拨号及通讯使用的 UDP 500、UDP 4500 等端口。
*   **TCP 22**：SSH 安全登录管理。
