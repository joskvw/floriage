# db layout

tables:
metadata/columns: id (uuid), community name, readable id (8 digit #)
posts/columns: id (snowflake like id containing date, actual snowflake is overkill ad), post text, post media (base64? inefficient but ez), user id, reactions? comments? idk yet.
users/columns: id (uuid), username, hashed pin, active time (utc unix timestamp?), vacation end (utc unix timestamp?)

## checking for activity (active time)

on login check to see if the current time is past the active time; active time is extended a week past the date of an action such as joining the community, posting, and nothing else

## vacation implementation

if the current time is before the vacation end time, the user is not allowed to access the community. Setting a vacation adds the vacation length (+ 2 day?) to the active time

## Secret phrase auth system

Instead making a good authentication system, I'm going to make an interesting one.

Auth flow:

1. Enter your username (which isn't globally unique)
   Ex: j

2. You will receive the first part of a secret phrase (this part is accessible by anyone with your public username)
   Ex: The darkness creeps to the sphere

3. You will enter the phrases second part (this part is secret, unique to each user, and should be hashed)
   Ex: but the world blinks in jest

Security:

- Should have 128 bits of entropy (or rate-limiting, captchas if we're being fancy)

### calculations:

https://gist.github.com/hugsy/8910dc78d208e40de42deb29e62df913
https://github.com/monolithpl/verb.forms.dictionary

fake-ish numbers for the calculations (there are probably more extensive lists, but I want to filter for expletives and super long words)
adjectives: 1300
nouns: 1500
verbs: 1500

Formats:

but the (noun) (verb)s in (adjective) (noun)
1300 x 1500 x 1500 = 2925000000 = ~31 bits of security
