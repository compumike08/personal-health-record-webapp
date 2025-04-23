# personal-health-record-webapp

## Running App
You must set the following environment variables prior to running:
- PHR_APP_JWT_SECRET (this value should be base64 encoded)

### For Dev
Run the following command: `mvn spring-boot:run`

### For Prod
You must set the following environment variables prior to running in production mode:
- POSTGRES_URL
- POSTGRES_PORT
- PHR_APP_DB_USER
- PHR_APP_DB_PASSWORD

Run the following command: `mvn spring-boot:run -Pprod`

## Copyright
&copy; 2025 compumike08 - All Rights Reserved
