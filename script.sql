DELIMITER $$
CREATE DEFINER=`dev`@`%` PROCEDURE `calculate_distance`(
    IN lat1 DECIMAL(10,6),
    IN lon1 DECIMAL(10,6),
    IN lat2 DECIMAL(10,6),
    IN lon2 DECIMAL(10,6),
    OUT distance DECIMAL(10,6)
)
BEGIN
    DECLARE earth_radius_km INT DEFAULT 6371;
    DECLARE d_lat DECIMAL(10,6);
    DECLARE d_lon DECIMAL(10,6);
    DECLARE a DECIMAL(10,6);
    DECLARE c DECIMAL(10,6);

    SET d_lat = RADIANS(lat2 - lat1);
    SET d_lon = RADIANS(lon2 - lon1);
    SET lat1 = RADIANS(lat1);
    SET lat2 = RADIANS(lat2);

    SET a = SIN(d_lat/2) * SIN(d_lat/2) + 
            COS(lat1) * COS(lat2) * 
            SIN(d_lon/2) * SIN(d_lon/2);
    SET c = 2 * ATAN2(SQRT(a), SQRT(1-a));

    SET distance = earth_radius_km * c;
END$$
DELIMITER ;

CALL calculate_distance(40.6892, -74.0445, 51.5074, -0.1278, @distance);
SELECT @distance;
