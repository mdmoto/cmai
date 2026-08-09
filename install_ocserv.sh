#!/bin/bash
set -e

echo "Installing ocserv and gnutls-bin..."
sudo apt-get update
sudo apt-get install -y ocserv gnutls-bin

echo "Generating certificates..."
mkdir -p /tmp/ocserv-certs
cd /tmp/ocserv-certs

# CA template
cat > ca.tmpl <<EOF
cn = "CMAI VPN CA"
organization = "Chiang Mai AI Center"
serial = 1
expiration_days = 3650
ca
signing_key
cert_signing_key
crl_signing_key
EOF

# Server template
cat > server.tmpl <<EOF
cn = "52.220.132.229"
organization = "Chiang Mai AI Center"
expiration_days = 3650
signing_key
encryption_key
tls_www_server
EOF

# Generate CA
certtool --generate-privkey --outfile ca-key.pem
certtool --generate-self-signed --load-privkey ca-key.pem --template ca.tmpl --outfile ca-cert.pem

# Generate Server Cert
certtool --generate-privkey --outfile server-key.pem
certtool --generate-certificate --load-privkey server-key.pem --load-ca-certificate ca-cert.pem --load-ca-privkey ca-key.pem --template server.tmpl --outfile server-cert.pem

# Copy keys to /etc/ocserv/
sudo cp ca-cert.pem /etc/ocserv/ca.pem
sudo cp server-cert.pem /etc/ocserv/server-cert.pem
sudo cp server-key.pem /etc/ocserv/server-key.pem

# Secure keys
sudo chmod 600 /etc/ocserv/server-key.pem

echo "Writing ocserv.conf..."
sudo tee /etc/ocserv/ocserv.conf <<EOF
auth = "plain[passwd=/etc/ocserv/ocpasswd]"
run-as-user = ocserv
run-as-group = ocserv
socket-file = /run/ocserv.socket
chroot-dir = /var/lib/ocserv

# TCP and UDP ports
tcp-port = 4443
udp-port = 4443

# Keepalive and timeouts
keepalive = 32400
dpd = 90
mobile-dpd = 1800
tunnel-all-dns = true

# Limit 1 device per user (同号踢人)
max-clients = 128
max-same-clients = 1

# MTU settings
try-mtu-discovery = true

# Certificate paths
server-cert = /etc/ocserv/server-cert.pem
server-key = /etc/ocserv/server-key.pem
ca-cert = /etc/ocserv/ca.pem

# TLS and cipher suite optimization
tls-priorities = "NORMAL:%COMPAT"

# Subnet configuration
ipv4-network = 192.168.44.0
ipv4-netmask = 255.255.255.0

# DNS servers
dns = 8.8.8.8
dns = 8.8.4.4

# Route all traffic through the VPN
route = default

# Enable compression
compression = true
EOF

echo "Creating empty password file..."
sudo touch /etc/ocserv/ocpasswd
sudo chmod 600 /etc/ocserv/ocpasswd

echo "Configuring firewall and routing..."
# Enable IP forwarding (just in case)
sudo sysctl -w net.ipv4.ip_forward=1

# Add masquerade rule for ocserv subnet
sudo iptables -t nat -C POSTROUTING -s 192.168.44.0/24 -o ens5 -j MASQUERADE 2>/dev/null || \
sudo iptables -t nat -A POSTROUTING -s 192.168.44.0/24 -o ens5 -j MASQUERADE

# Save iptables rules
sudo iptables-save | sudo tee /etc/iptables/rules.v4

echo "Restarting ocserv service..."
sudo systemctl daemon-reload
sudo systemctl enable ocserv.service
sudo systemctl restart ocserv.service

echo "ocserv installation and configuration completed successfully!"
