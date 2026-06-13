#!/bin/bash
# TruckMitra Database Backup Script

BACKUP_DIR="/backups/mysql"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_NAME="truckmitra"
DB_USER="root"
DB_PASS="root"

mkdir -p $BACKUP_DIR

echo "Starting backup of $DB_NAME..."
docker exec truckmitra-db /usr/bin/mysqldump -u$DB_USER -p$DB_PASS $DB_NAME > $BACKUP_DIR/backup_$TIMESTAMP.sql

if [ $? -eq 0 ]; then
    echo "Backup successful: $BACKUP_DIR/backup_$TIMESTAMP.sql"
    # Keep only last 7 days
    find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
else
    echo "Backup failed!"
    exit 1
fi
