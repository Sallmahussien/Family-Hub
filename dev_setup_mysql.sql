-- Create FamilyHub db
CREATE DATABASE IF NOT EXISTS `FamilyHub`;

CREATE USER IF NOT EXISTS 'SKY'@'localhost' IDENTIFIED BY 'SKY_pwd';

GRANT ALL PRIVILEGES ON `FamilyHub`.* TO 'SKY'@'localhost';

GRANT SELECT ON `performance_schema`.* TO 'SKY'@'localhost';

FLUSH PRIVILEGES;