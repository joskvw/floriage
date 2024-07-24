# db layout

tables:
metadata/columns: id (uuid), community name, readable id (8 digit #)
posts/columns: id (snowflake like id containing date, actual snowflake is overkill ad), post text, post media (base64? inefficient but ez), user id, reactions? comments? idk yet.
users/columns: id (uuid), username, hashed pin, active time (utc unix timestamp?), vacation end (utc unix timestamp?)

## checking for activity (active time)

on login check to see if the current time is past the active time; active time is extended a week past the date of an action such as joining the community, posting, and nothing else

## vacation implementation

if the current time is before the vacation end time, the user is not allowed to access the community. Setting a vacation adds the vacation length (+ 2 day?) to the active time
