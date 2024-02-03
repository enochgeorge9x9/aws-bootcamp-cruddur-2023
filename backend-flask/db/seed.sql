-- this file was manually created
INSERT INTO public.users (display_name, handle, email,cognito_user_id)
VALUES
    ('Iron Man', 'ironman','ironman@gmail.com', 'MOCK'),
    ('Andrew Brown', 'andrewbrown','andrewbrown@gmail.com', 'MOCK'),
    ('Super Man', 'superman','superman@gmail.com', 'MOCK');

INSERT INTO public.activities (user_uuid, message, expires_at)
VALUES (
        (SELECT uuid from public.users WHERE users.handle = 'andrewbrown' LIMIT 1),
        'This was a imported as seed data!',
        current_timestamp + interval '10 day'
    );