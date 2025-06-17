-- inserts a row into public.profiles
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id, 
    new.email,
    new.raw_user_meta_data ->> 'full_name'
  );
  return new;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


create policy "Allow authenticated users to select profiles" 
on public.profiles 
for select 
to authenticated 
using (true);

create policy "Allow authenticated users to insert profiles" 
on public.profiles 
for insert 
to authenticated 
with check (id = auth.uid());

create policy "Allow authenticated users to update their profiles" 
on public.profiles 
for update 
to authenticated 
using (id = auth.uid()) 
with check (id = auth.uid());

create policy "Allow authenticated users to delete their profiles" 
on public.profiles 
for delete 
to authenticated 
using (id = auth.uid());