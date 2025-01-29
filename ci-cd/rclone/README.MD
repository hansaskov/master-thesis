# Introduction to rclone

**rclone** is a command-line Swiss Army knife for cloud storage, supporting **70+ providers** including S3-compatible services like Cloudflare R2 and Hetzner Storage. Ideal for database backups, migrations, and encrypted transfers.

---

### Key Features  
- S3-compatible provider support (R2, Hetzner, etc.)  
- End-to-end encryption (`rclone crypt`)  
- Bandwidth controls & parallel transfers  
- Scriptable backups with cron/automation  

---

### Database Backup Examples  

#### 1. **PostgreSQL Backup to Hetzner Storage**  
*Configure Hetzner:*  
```bash
rclone config create hetzner-remote s3 \
  provider="Other" \
  access_key_id="YOUR_HETZNER_KEY" \
  secret_access_key="YOUR_HETZNER_SECRET" \
  endpoint="https://BUCKET.obs.eu-central-1.hetzner.com"
```

*Daily backup script:*  
```bash
#!/bin/bash
pg_dump -U postgres mydb | gzip > pg_backup_$(date +%F).sql.gz
rclone sync --progress --delete-before ./pg_backup*.sql.gz hetzner-remote:db-backups/
```


---

### Installation  
```bash
# Linux/macOS (one-liner)
curl https://rclone.org/install.sh | sudo bash
```
[Documentation](https://rclone.org/s3/#cloudflare-r2) | [R2 Setup Guide](https://developers.cloudflare.com/r2/api/s3/api/)  
