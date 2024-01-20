-- this file was manually created
INSERT INTO public.users (display_name, handle, cognito_user_id)
VALUES
    ('Iron Man', 'ironman', 'MOCK'),
    ('Andrew Brown', 'andrewbrown', 'MOCK'),
    ('Super Man', 'superman', 'MOCK');

INSERT INTO public.activities (user_uuid, message, expires_at)
VALUES (
        (SELECT uuid from public.users WHERE users.handle = 'andrewbrown' LIMIT 1),
        'This was a imported as seed data!',
        current_timestamp + interval '10 day'
    );