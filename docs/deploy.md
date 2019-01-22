# 部署指南

这里以腾讯云CVM(CentOS 7.5 64位)为例子做介绍

## 准备

` bash
sudo yum install nodejs
sudo yum install mariadb-server
sudo systemctl start mariadb
cd ~
git clone https://github.com/uhziel/yijie_cp_server.git
cd yijie_cp_server/
./init_mysql.sh
npm start
`