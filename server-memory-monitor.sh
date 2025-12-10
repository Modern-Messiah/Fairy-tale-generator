#!/bin/bash

# Мониторинг памяти для продакшн сервера
# Cron: */10 * * * * /opt/memory-monitor.sh

LOG_FILE="/var/log/memory-monitor.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

# Пороги для сервера
CRITICAL_MEMORY=500  # MB
WARNING_MEMORY=1000  # MB

FREE_MEM=$(free -m | awk 'NR==2{printf "%.0f", $7}')
SWAP_USED=$(free -m | awk 'NR==3{printf "%.0f", $3}')

echo "[$DATE] Memory: ${FREE_MEM}MB free, Swap: ${SWAP_USED}MB used" >> $LOG_FILE

# Критическая нехватка памяти
if [ $FREE_MEM -lt $CRITICAL_MEMORY ]; then
    echo "[$DATE] CRITICAL: Memory below ${CRITICAL_MEMORY}MB!" >> $LOG_FILE
    
    # Очистка системного кеша
    sync && echo 3 > /proc/sys/vm/drop_caches
    echo "[$DATE] System cache cleared" >> $LOG_FILE
    
    # Перезапуск основных сервисов
    systemctl restart nginx
    systemctl restart php-fpm
    systemctl restart mysql
    echo "[$DATE] Services restarted" >> $LOG_FILE
    
    # Остановка Docker контейнеров
    docker stop $(docker ps -q)
    docker system prune -f
    echo "[$DATE] Docker containers stopped and cleaned" >> $LOG_FILE
    
fi

# Предупреждающий уровень
if [ $FREE_MEM -lt $WARNING_MEMORY ]; then
    echo "[$DATE] WARNING: Memory below ${WARNING_MEMORY}MB" >> $LOG_FILE
    
    # Очистка логов
    find /var/log -name "*.log" -mtime +3 -delete
    journalctl --vacuum-time=3d
    
    # Очистка временных файлов
    rm -rf /tmp/*
    rm -rf /var/tmp/*
    
    echo "[$DATE] Temporary files and logs cleaned" >> $LOG_FILE
fi

# Мониторинг Docker контейнеров
if command -v docker &> /dev/null; then
    docker stats --no-stream --format "table {{.Name}}\t{{.MemUsage}}\t{{.MemPerc}}" >> $LOG_FILE
fi