import os
import re
import subprocess
from flask import Flask, request, render_template_string, redirect, url_for, session, flash

app = Flask(__name__)
app.secret_key = os.urandom(24)

# Admin Configuration
ADMIN_PASSWORD = "Cmai@Secure2026"
SECRETS_FILE = "/etc/ppp/chap-secrets"
ADD_USER_SCRIPT = "/usr/bin/addvpnuser.sh"
DEL_USER_SCRIPT = "/usr/bin/delvpnuser.sh"

HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="zh-CN" class="h-full bg-neutral-950">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CMAI VPN Admin Portal</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="h-full text-neutral-100 flex flex-col justify-between">

    <!-- Header -->
    <header class="bg-neutral-900 border-b border-neutral-800">
        <div class="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            <div class="flex items-center gap-2">
                <span class="text-lg font-bold tracking-widest text-white">CMAI<span class="text-neutral-500 font-light">.</span></span>
                <span class="px-2 py-0.5 rounded bg-neutral-800 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">VPN Admin</span>
            </div>
            {% if logged_in %}
            <a href="{{ url_for('logout') }}" class="text-xs font-medium text-neutral-400 hover:text-white transition-colors">
                退出登录 / Logout
            </a>
            {% endif %}
        </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow max-w-5xl w-full mx-auto px-6 py-10">
        {% if not logged_in %}
        <!-- Login Form -->
        <div class="max-w-md mx-auto mt-16 bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-xl">
            <div class="text-center mb-8">
                <h1 class="text-xl font-bold text-white mb-2">VPN 管理员登录</h1>
                <p class="text-xs text-neutral-400">VPN Admin Login Portal</p>
            </div>
            
            {% with messages = get_flashed_messages() %}
              {% if messages %}
                {% for message in messages %}
                  <div class="p-3 mb-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-center">
                    {{ message }}
                  </div>
                {% endfor %}
              {% endif %}
            {% endwith %}

            <form action="{{ url_for('login') }}" method="POST" class="space-y-6">
                <div>
                    <label class="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">管理员密码 / Password</label>
                    <input type="password" name="password" required class="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-neutral-500 transition-colors">
                </div>
                <button type="submit" class="w-full py-3 bg-white hover:bg-neutral-200 text-neutral-950 rounded-lg font-semibold text-sm transition-all active:scale-[0.98]">
                    登录 / Log In
                </button>
            </form>
        </div>
        {% else %}
        <!-- Dashboard -->
        <div class="space-y-8">
            <!-- Alert message banner -->
            {% with messages = get_flashed_messages(with_categories=true) %}
              {% if messages %}
                {% for category, message in messages %}
                  <div class="p-4 rounded-xl border text-sm {{ 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' if category == 'success' else 'bg-rose-500/10 border-rose-500/20 text-rose-400' }}">
                    {{ message }}
                  </div>
                {% endfor %}
              {% endif %}
            {% endwith %}

            <!-- Stats/Server Info -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="bg-neutral-900 border border-neutral-850 rounded-xl p-5">
                    <div class="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">服务器 IP / Server IP</div>
                    <div class="text-lg font-bold text-white">52.220.132.229</div>
                </div>
                <div class="bg-neutral-900 border border-neutral-850 rounded-xl p-5">
                    <div class="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">L2TP 预共享密钥 / L2TP PSK</div>
                    <div class="text-lg font-bold text-white">CmaiPsk2026</div>
                </div>
                <div class="bg-neutral-900 border border-neutral-850 rounded-xl p-5">
                    <div class="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">思科 AnyConnect 地址 / Cisco Server</div>
                    <div class="text-lg font-bold text-white">52.220.132.229:4443</div>
                </div>
            </div>

            <!-- Users List Table -->
            <div class="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
                <div class="px-6 py-5 border-b border-neutral-800 flex items-center justify-between">
                    <div>
                        <h2 class="text-base font-bold text-white">用户列表 / User Directory</h2>
                        <p class="text-xs text-neutral-400 mt-0.5">创建、修改或删除 VPN 账号 (同时同步至 L2TP/IPsec 和 思科 AnyConnect)</p>
                    </div>
                    <button onclick="openModal('add')" class="px-4 py-2 bg-white hover:bg-neutral-200 text-neutral-950 font-semibold text-xs rounded-full transition-all active:scale-[0.97]">
                        + 新增用户 / Add User
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="border-b border-neutral-850 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                                <th class="px-6 py-4">用户名 / Username</th>
                                <th class="px-6 py-4">密码 / Password</th>
                                <th class="px-6 py-4 text-right">操作 / Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-neutral-850 text-sm">
                            {% for user in users %}
                            <tr class="hover:bg-neutral-850/30 transition-colors">
                                <td class="px-6 py-4.5 font-semibold text-white">{{ user.username }}</td>
                                <td class="px-6 py-4.5 font-mono text-neutral-400">{{ user.password }}</td>
                                <td class="px-6 py-4.5 text-right space-x-2">
                                    <button onclick="openEditModal('{{ user.username }}', '{{ user.password }}')" class="text-xs font-medium text-neutral-400 hover:text-white transition-colors">
                                        修改 / Edit
                                    </button>
                                    {% if user.username != 'cmai_vpn' %}
                                    <button onclick="openDeleteModal('{{ user.username }}')" class="text-xs font-medium text-rose-500 hover:text-rose-400 transition-colors">
                                        删除 / Delete
                                    </button>
                                    {% endif %}
                                </td>
                            </tr>
                            {% endfor %}
                            {% if not users %}
                            <tr>
                                <td colspan="3" class="px-6 py-12 text-center text-xs text-neutral-500">
                                    暂无用户数据 / No VPN users found.
                                </td>
                            </tr>
                            {% endif %}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Add User Modal -->
        <div id="addModal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden items-center justify-center p-4">
            <div class="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6 relative">
                <h3 class="text-lg font-bold text-white mb-2">新增 VPN 用户</h3>
                <p class="text-xs text-neutral-400 mb-6">Create a new VPN client account</p>
                <form action="{{ url_for('add_user') }}" method="POST" class="space-y-4">
                    <div>
                        <label class="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">用户名 / Username</label>
                        <input type="text" name="username" required pattern="[A-Za-z0-9_]+" title="仅支持英文字母、数字和下划线" class="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-neutral-500">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">密码 / Password</label>
                        <input type="text" name="password" required minlength="6" class="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-neutral-500">
                    </div>
                    <div class="flex justify-end gap-3 pt-4 border-t border-neutral-800">
                        <button type="button" onclick="closeModal('add')" class="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors">取消 / Cancel</button>
                        <button type="submit" class="px-5 py-2 bg-white hover:bg-neutral-200 text-neutral-950 font-semibold text-xs rounded-full transition-all active:scale-[0.97]">确认创建 / Create</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Edit User Modal -->
        <div id="editModal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden items-center justify-center p-4">
            <div class="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6 relative">
                <h3 class="text-lg font-bold text-white mb-2">修改用户密码</h3>
                <p class="text-xs text-neutral-400 mb-6">Update VPN client credentials</p>
                <form action="{{ url_for('add_user') }}" method="POST" class="space-y-4">
                    <input type="hidden" name="username" id="edit_username">
                    <div>
                        <label class="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">用户名 / Username</label>
                        <input type="text" id="edit_username_display" disabled class="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-500">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">新密码 / New Password</label>
                        <input type="text" name="password" id="edit_password" required minlength="6" class="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-neutral-500">
                    </div>
                    <div class="flex justify-end gap-3 pt-4 border-t border-neutral-800">
                        <button type="button" onclick="closeModal('edit')" class="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors">取消 / Cancel</button>
                        <button type="submit" class="px-5 py-2 bg-white hover:bg-neutral-200 text-neutral-950 font-semibold text-xs rounded-full transition-all active:scale-[0.97]">保存修改 / Save</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Delete Confirm Modal -->
        <div id="deleteModal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden items-center justify-center p-4">
            <div class="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6 relative">
                <h3 class="text-lg font-bold text-rose-500 mb-2">确认删除用户？</h3>
                <p class="text-xs text-neutral-400 mb-6">Are you sure you want to permanently revoke this VPN account?</p>
                <form action="{{ url_for('delete_user') }}" method="POST">
                    <input type="hidden" name="username" id="delete_username">
                    <p class="text-sm text-neutral-300 mb-6">删除用户后，对应员工的 iPhone/电脑 将立刻中断 VPN 连接且无法重新接入。</p>
                    <div class="flex justify-end gap-3 pt-4 border-t border-neutral-800">
                        <button type="button" onclick="closeModal('delete')" class="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors">取消 / Cancel</button>
                        <button type="submit" class="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-full transition-all active:scale-[0.97]">确认删除 / Delete</button>
                    </div>
                </form>
            </div>
        </div>

        <script>
            function openModal(id) {
                const el = document.getElementById(id + 'Modal');
                el.classList.remove('hidden');
                el.classList.add('flex');
            }
            function closeModal(id) {
                const el = document.getElementById(id + 'Modal');
                el.classList.remove('flex');
                el.classList.add('hidden');
            }
            function openEditModal(username, password) {
                document.getElementById('edit_username').value = username;
                document.getElementById('edit_username_display').value = username;
                document.getElementById('edit_password').value = password;
                openModal('edit');
            }
            function openDeleteModal(username) {
                document.getElementById('delete_username').value = username;
                openModal('delete');
            }
        </script>
        {% endif %}
    </main>

    <!-- Footer -->
    <footer class="py-6 border-t border-neutral-900 bg-neutral-950">
        <div class="max-w-5xl mx-auto px-6 text-center text-[10px] text-neutral-500">
            &copy; {{ year }} Chiang Mai AI Center. All rights reserved. Secure Administrative Interface.
        </div>
    </footer>

</body>
</html>
"""

def get_vpn_users():
    users = []
    if not os.path.exists(SECRETS_FILE):
        return users
    try:
        with open(SECRETS_FILE, "r") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                # Format: "username" l2tpd "password" *
                match = re.match(r'^"([^"]+)"\s+(\S+)\s+"([^"]+)"\s+\*$', line)
                if match:
                    users.append({
                        "username": match.group(1),
                        "password": match.group(3)
                    })
    except Exception as e:
        print(f"Error reading secrets: {e}")
    return users

@app.route("/")
def home():
    logged_in = session.get("logged_in", False)
    users = get_vpn_users() if logged_in else []
    import datetime
    return render_template_string(
        HTML_TEMPLATE, 
        logged_in=logged_in, 
        users=users, 
        year=datetime.date.today().year
    )

@app.route("/login", methods=["POST"])
def login():
    password = request.form.get("password")
    if password == ADMIN_PASSWORD:
        session["logged_in"] = True
        return redirect(url_for("home"))
    else:
        flash("密码错误，请重新输入 / Incorrect password.")
        return redirect(url_for("home"))

@app.route("/logout")
def logout():
    session.pop("logged_in", None)
    return redirect(url_for("home"))

@app.route("/add-user", methods=["POST"])
def add_user():
    if not session.get("logged_in", False):
        return redirect(url_for("home"))
    
    username = request.form.get("username", "").strip()
    password = request.form.get("password", "").strip()
    
    if not username or not password:
        flash("用户名和密码不能为空 / Username and password cannot be empty.", "error")
        return redirect(url_for("home"))
    
    if not re.match(r"^[A-Za-z0-9_]+$", username):
        flash("用户名仅支持英文字母、数字和下划线 / Username only supports alphanumeric and underscore.", "error")
        return redirect(url_for("home"))

    try:
        # Run setup-ipsec-vpn add user script
        res = subprocess.run(
            ["sudo", ADD_USER_SCRIPT, username, password],
            capture_output=True,
            text=True
        )
        if res.returncode == 0:
            # Sync to ocserv (OpenConnect / AnyConnect)
            try:
                # Generate hash using openssl
                hash_res = subprocess.run(
                    ["openssl", "passwd", "-6", password],
                    capture_output=True,
                    text=True,
                    check=True
                )
                pwd_hash = hash_res.stdout.strip()
                
                # Update /etc/ocserv/ocpasswd
                oc_file = "/etc/ocserv/ocpasswd"
                lines = []
                if os.path.exists(oc_file):
                    with open(oc_file, "r") as f:
                        lines = f.readlines()
                
                new_lines = []
                for line in lines:
                    if line.strip() and line.split(":")[0] == username:
                        continue
                    new_lines.append(line)
                
                new_lines.append(f"{username}::{pwd_hash}\n")
                
                with open(oc_file, "w") as f:
                    f.writelines(new_lines)
                
                flash(f"用户 '{username}' 保存成功 (已同步至 L2TP 和 AnyConnect) / User saved successfully.", "success")
            except Exception as e:
                flash(f"L2TP 保存成功，但同步至 AnyConnect 失败: {e} / L2TP saved, but failed to sync to AnyConnect.", "error")
        else:
            flash(f"保存失败 / Failed to save: {res.stderr or res.stdout}", "error")
    except Exception as e:
        flash(f"系统错误 / System error: {e}", "error")
        
    return redirect(url_for("home"))

@app.route("/delete-user", methods=["POST"])
def delete_user():
    if not session.get("logged_in", False):
        return redirect(url_for("home"))
    
    username = request.form.get("username", "").strip()
    if not username:
        flash("用户名不能为空 / Username cannot be empty.", "error")
        return redirect(url_for("home"))
        
    if username == "cmai_vpn":
        flash("默认管理员账号不可删除 / Default admin account cannot be deleted.", "error")
        return redirect(url_for("home"))

    try:
        res = subprocess.run(
            ["sudo", DEL_USER_SCRIPT, username],
            capture_output=True,
            text=True
        )
        if res.returncode == 0:
            # Sync to ocserv (OpenConnect / AnyConnect)
            try:
                oc_file = "/etc/ocserv/ocpasswd"
                if os.path.exists(oc_file):
                    with open(oc_file, "r") as f:
                        lines = f.readlines()
                    new_lines = []
                    for line in lines:
                        if line.strip() and line.split(":")[0] == username:
                            continue
                        new_lines.append(line)
                    with open(oc_file, "w") as f:
                        f.writelines(new_lines)
                flash(f"用户 '{username}' 已成功删除 (已从 L2TP 和 AnyConnect 移除) / User deleted successfully.", "success")
            except Exception as e:
                flash(f"L2TP 用户已删除，但从 AnyConnect 移除失败: {e} / L2TP user deleted, but failed to remove from AnyConnect.", "error")
        else:
            flash(f"删除失败 / Failed to delete: {res.stderr or res.stdout}", "error")
    except Exception as e:
        flash(f"系统错误 / System error: {e}", "error")
        
    return redirect(url_for("home"))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=2055)
