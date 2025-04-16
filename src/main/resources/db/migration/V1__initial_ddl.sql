CREATE TABLE user_role (
    id BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE user_record (
    id BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY,
    user_uuid uuid NOT NULL UNIQUE default gen_random_uuid(),
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(300) NOT NULL UNIQUE,
    password VARCHAR(1000) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE user_user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id)
);

ALTER TABLE user_user_roles
    ADD CONSTRAINT fk_user_record_user_user_roles FOREIGN KEY (user_id) REFERENCES user_record;

ALTER TABLE user_user_roles
    ADD CONSTRAINT fk_user_role_user_user_roles FOREIGN KEY (role_id) REFERENCES user_role;
