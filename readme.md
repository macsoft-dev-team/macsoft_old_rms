wget https://www.emqx.com/en/downloads/enterprise/5.10.0/emqx-enterprise-5.10.0-ubuntu22.04-amd64.tar.gz

mkdir -p emqx && tar -zxvf emqx-enterprise-5.10.0-ubuntu22.04-amd64.tar.gz -C emqx

./emqx/bin/emqx start

