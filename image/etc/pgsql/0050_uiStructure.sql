
\o /dev/null
\c vino
\set VERBOSITY terse
set client_min_messages=WARNING;

-- ===================================================================================================================

select createSchema('abacus_ui');

-- ===================================================================================================================

/*
do $$
   declare version abacus.version_information;
   declare schemaName text;
   declare tableName text;
   begin
      tableName := 'modules';
      schemaName := 'abacus_ui';
      version := abacus.tableVersion(schemaName, tableName);
      case version.major
         when -1 then
            create table abacus_ui.modules
            (
               module varchar primary key,
               script_directory varchar not null
            );
            perform abacus.initializeTable(schemaName, tableName, 1,0,0,0);
         else
           raise info '%.% table at version [%] present, no upgrade needed', schemaName, tableName, version.major;
      end case;
   end
$$;
*/
-- ===================================================================================================================
/*
create or replace function abacus_ui.uiStructureAddModule(newModule text, newScriptDir text) returns void as $$
   begin
      if exists(select * from abacus_ui.modules where module = newModule)
      then
         update abacus_ui.modules set script_directory = newScriptDir where module = newModule;
      else
         insert into abacus_ui.modules(module, script_directory) values (newModule, newScriptDir);
      end if;
   end;
$$ language plpgsql;
*/
-- ===================================================================================================================
/*
do $$
   declare version abacus.version_information;
   declare schemaName text;
   declare tableName text;
   begin
      tableName := 'module_role_map';
      schemaName := 'abacus_ui';
      version := abacus.tableVersion(schemaName, tableName);
      case version.major
         when -1 then
            create table abacus_ui.module_role_map
            (
               module varchar not null references abacus_ui.modules(module),
               role varchar not null references abacus_auth.user_roles(role),
               primary key (module, role)
            );
            comment on table abacus_ui.module_role_map is
               'Maps user roles to modules.  Each row identifies a role, module mapping which says "this role can access this module"';
            perform abacus.initializeTable(schemaName, tableName, 1,0,0,0);
         else
           raise info '%.% table at version [%] present, no upgrade needed', schemaName, tableName, version.major;
      end case;
   end
$$;
*/
-- ===================================================================================================================
/*
do $$
   declare version abacus.version_information;
   declare schemaName text;
   declare tableName text;
   begin
      tableName := 'menu_items';
      schemaName := 'abacus_ui';
      version := abacus.tableVersion(schemaName, tableName);
      case version.major
         when -1 then
            create table abacus_ui.menu_items
            (
               module varchar not null references abacus_ui.modules(module),
               role varchar not null references abacus_auth.user_roles(role),
               menu_item_id varchar not null,
               menu_item_title varchar,
               menu_item_target varchar default('_self'),
               menu_item_script varchar,
               menu_item_command varchar,
               menu_item_generator varchar,
               menu_item_url varchar,
               menu_item_glyphicon varchar,
               primary key (module, menu_item_title, menu_item_id),
               unique (menu_item_id)
            );
            comment on table abacus_ui.menu_items is 'Create the list of menu items';
            comment on column abacus_ui.menu_items.menu_item_id is 'This is required, it will be referenced by the primary key and the menu_structure table';
            perform abacus.initializeTable(schemaName, tableName, 1,0,0,0);
         else
           raise info '%.% table at version [%] present, no upgrade needed', schemaName, tableName, version.major;
      end case;
   end
$$;
*/
-- ===================================================================================================================
/*
create or replace function abacus_ui.uiStructureAddMenuItem(moduleName text,
                                                            roleName text,
                                                            parentId text,
                                                            id text,
                                                            title text,
                                                            target text,
                                                            script text,
                                                            command text,
                                                            generator text,
                                                            url text,
                                                            glyph text,
                                                            ord int default 0) returns void as $$
   begin
      perform abacus_ui.uiStructureUpsertMenuItem(moduleName, roleName, id, title, target, script, command, generator, url, glyph);
      if ( id = parentId and parentId = title )
      then
      else
         perform abacus_ui.uiStructureAddMenu(id, parentId, ord);
      end if;
   end;
$$ language plpgsql;
*/
-- ===================================================================================================================
/*
create or replace function abacus_ui.uiStructureUpsertMenuItem(moduleName text,
                                                               roleName text,
                                                               id text,
                                                               title text,
                                                               target text,
                                                               script text,
                                                               command text,
                                                               generator text,
                                                               url text,
                                                               glyphicon text) returns void as $$
   begin
      if ( glyphicon = null )
      then
      else
         title = '&nbsp;' || title;
      end if;

      if exists(select * from abacus_ui.menu_items where module = moduleName and menu_item_title = title and menu_item_id = id )
      then
         update abacus_ui.menu_items
            set
               role = roleName,
               menu_item_target = target,
               menu_item_script = script,
               menu_item_command = command,
               menu_item_generator = generator,
               menu_item_url = url,
               menu_item_glyphicon = glyphicon
            where module = moduleName
               and menu_item_title = title
               and menu_item_id = id;
      else
         insert into abacus_ui.menu_items(module,
                                          role,
                                          menu_item_id,
                                          menu_item_title,
                                          menu_item_target,
                                          menu_item_script,
                                          menu_item_command,
                                          menu_item_generator,
                                          menu_item_url,
                                          menu_item_glyphicon)
            values (moduleName, roleName, id, title, target, script, command, generator, url, glyphicon);
      end if;
   end;
$$ language plpgsql;
*/
-- ===================================================================================================================
/*
do $$
   declare version abacus.version_information;
   declare schemaName text;
   declare tableName text;
   begin
      tableName := 'menu_structure';
      schemaName := 'abacus_ui';
      version := abacus.tableVersion(schemaName, tableName);
      case version.major
         when -1 then
            create table abacus_ui.menu_structure
            (
               node varchar not null references abacus_ui.menu_items(menu_item_id),
               parent varchar not null references abacus_ui.menu_items(menu_item_id),
               ordinal int default 0,
               primary key (node, parent)
            );
            comment on table abacus_ui.menu_structure is 'defines the menu structure';
            perform abacus.initializeTable(schemaName, tableName, 1,0,0,0);
         else
           raise info '%.% table at version [%] present, no upgrade needed', schemaName, tableName, version.major;
      end case;
   end
$$;
*/
-- ===================================================================================================================
/*
create or replace function abacus_ui.uiStructureAddMenu(nodeId text, parentId text, ord int default 0) returns void as $$
  begin
     if not exists(select * from abacus_ui.menu_structure where node = nodeId and parent = parentId)
     then
        insert into abacus_ui.menu_structure(node, parent, ordinal) values (nodeId, parentId, ord);
     end if;
  end;
$$ language plpgsql;
*/
-- ===================================================================================================================
/*
do $$
   declare version abacus.version_information;
   declare schemaName text;
   declare tableName text;
   begin
      tableName := 'home_pages';
      schemaName := 'abacus_ui';
      version := abacus.tableVersion(schemaName, tableName);
      case version.major
         when -1 then
            create table abacus_ui.home_pages
            (
               id  varchar not null primary key,
               module varchar not null references abacus_ui.modules,
               role varchar not null references abacus_auth.user_roles,
               title varchar not null,
               script varchar not null,
               command varchar not null,
               default_open boolean not null default false
            );
            comment on table abacus_ui.home_pages is
               'The home page will have an expandable list of acordian panels which can be added to';
            perform abacus.initializeTable(schemaName, tableName, 1,0,0,0);
         else
           raise info '%.% table at version [%] present, no upgrade needed', schemaName, tableName, version.major;
      end case;
   end
$$;
*/
-- ===================================================================================================================
/*
create or replace function abacus_ui.uiAddHomePage(idParam text,
                                                   moduleParam text,
                                                   roleParam text,
                                                   titleParam text,
                                                   scriptParam text,
                                                   commandParam text,
                                                   default_openParam boolean) returns void as $$
   begin
      if exists(select * from abacus_ui.home_pages where id = idParam)
      then
         update abacus_ui.home_pages
            set
               module = moduleParam,
               role = roleParam,
               title = titleParam,
               script = scriptParam,
               command = commandParam,
               default_open = default_openParam
            where id = idParam;
      else
         INSERT INTO abacus_ui.home_pages VALUES (idParam, moduleParam, roleParam, titleParam, scriptParam, commandParam, default_openParam);
      end if;
   end;
$$ language plpgsql;
*/
-- ===================================================================================================================
/*
do $$
   declare version abacus.version_information;
   declare schemaName text;
   declare tableName text;
   begin
      tableName := 'tasks';
      schemaName := 'abacus_ui';
      version := abacus.tableVersion(schemaName, tableName);
      case version.major
         when -1 then
            create table abacus_ui.tasks
            (
               id  varchar not null primary key,
               module varchar not null references abacus_ui.modules,
               role varchar not null references abacus_auth.user_roles,
               label varchar not null,
               script varchar not null,
               command varchar not null,
               enabled boolean not null default false
            );
            comment on table abacus_ui.tasks is 'list of tasks which will be displayed in a task list';
            perform abacus.initializeTable(schemaName, tableName, 1,0,0,0);
         else
           raise info '%.% table at version [%] present, no upgrade needed', schemaName, tableName, version.major;
      end case;
   end
$$;
*/
-- ===================================================================================================================
/*
create or replace function abacus_ui.uiAddTaskPanelItem(idParam text,
                                                        moduleParam text,
                                                        roleParam text,
                                                        labelParam text,
                                                        scriptParam text,
                                                        commandParam text,
                                                        enabledParam boolean) returns void as $$
   begin
      if exists(select * from abacus_ui.tasks where id = idParam)
      then
         update abacus_ui.tasks
            set
               module = moduleParam,
               role = roleParam,
               label = labelParam,
               script = scriptParam,
               command = commandParam,
               enabled = enabledParam
            where id = idParam;
      else
         INSERT INTO abacus_ui.tasks(id, module, role, label, script, command, enabled)
            values (idParam, moduleParam, roleParam, labelParam, scriptParam, commandParam, enabledParam);
      end if;
   end;
$$ language plpgsql;
*/
-- ===================================================================================================================

do $$
   declare version abacus.version_information;
   declare schemaName text;
   declare tableName text;
   begin
      tableName := 'menu_items';
      schemaName := 'abacus_ui';
      version := abacus.tableVersion(schemaName, tableName);
      case version.major
         when -1 then
            create table abacus_ui.menu_items
            (
               allowed_role varchar not null references abacus_auth.user_roles(role),
               parent_id varchar,
               id varchar primary key,
               title varchar,
               target varchar default('_self'),
               script varchar,
               command varchar,
               generator varchar,
               url varchar,
               glyphicon varchar,
               ordinal int
            );
            perform abacus.initializeTable(schemaName, tableName, 1,0,0,0);
         else
           raise info '%.% table at version [%] present, no upgrade needed', schemaName, tableName, version.major;
      end case;
   end
$$;

create or replace function abacus_ui.uiStructureAddMenuItem(roleName text,
                                                            parentId text,
                                                            menuId text,
                                                            newTitle text,
                                                            newTarget text,
                                                            newScript text,
                                                            newCommand text,
                                                            newGenerator text,
                                                            newUrl text,
                                                            newIcon text,
                                                            newOrdinal int default 0) returns void as $$
   begin
      if ( newIcon = null )
      then
      else
         newTitle = '&nbsp;' || newTitle;
      end if;

      if exists(select * from abacus_ui.menu_items where id = menuId )
      then
         update abacus_ui.menu_items
            set
               allowed_role = roleName,
               parent_id = parentId,
               title = newTitle,
               target = newTarget,
               script = newScript,
               command = newCommand,
               generator = newGenerator,
               url = newUrl,
               glyphicon = newIcon,
               ordinal = newOrdinal
            where id = menuId;
      else
         insert into abacus_ui.menu_items(allowed_role,
                                          parent_id,
                                          id,
                                          title,
                                          target,
                                          script,
                                          command,
                                          generator,
                                          url,
                                          glyphicon,
                                          ordinal)
            values (roleName, parentId, menuId, newTitle, newTarget, newScript, newCommand, newGenerator, newUrl, newIcon, newOrdinal);
      end if;
   end;
$$ language plpgsql;

