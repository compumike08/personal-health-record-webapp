# personal-health-record-webapp

## DANGER!
This application is **not** intended for use with real medical data.
It is not HIPPA compliant, and has not been evaluated for security
vulnerabilities. **DO NOT USE IT WITH REAL DATA!** If you choose to use it with
real data despite this warning, we are not responsible for the results.

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
