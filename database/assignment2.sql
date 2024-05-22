
--STEP ONE--
INSERT INTO account (
    account_firstname,
    account_lastname,
    account_email,
    account_password
)
VALUES('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

--STEP TWO--
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

--STEP THREE--
DELETE FROM account
WHERE account_email = 'tony@starkent.com';

--STEP FOUR--
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_ID = 10;

--STEP FIVE--
SELECT 
    inventory.inv_make,
    inventory.inv_model,
    classification.classification_name
FROM 
    inventory
INNER JOIN 
    classification
ON 
    inventory.classification_id = classification.classification_id
WHERE 
    classification.classification_name = 'Sport';

--STEP SIX--
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
 inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');

