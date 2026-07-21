# HestiaCP nginx template - HTTP (port 80) za mikulicknjige.com
# Instalacija na serveru (kao root):
#   cp NodeApp3006.tpl  /usr/local/hestia/data/templates/web/nginx/NodeApp3006.tpl
#   cp NodeApp3006.stpl /usr/local/hestia/data/templates/web/nginx/NodeApp3006.stpl
#   v-change-web-domain-tpl adizeljkovic mikulicknjige.com NodeApp3006 yes
#
# Nakon ovoga HestiaCP regenerise conf IZ OVOG TEMPLATEA, pa rucne izmjene
# /etc/nginx/conf.d/domains/mikulicknjige.com.conf vise nisu potrebne ni moguce
# da budu pregazene.

server {
    listen      %ip%:%web_port%;
    server_name %domain_idn% %alias_idn%;

    # HTTP -> HTTPS
    return 301 https://$host$request_uri;

    include %home%/%user%/conf/web/%domain%/nginx.conf_*;
}
