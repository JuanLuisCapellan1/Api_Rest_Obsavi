create database OBSAVI;

use OBSAVI;

drop table if exists users;
create table users(
	id int auto_increment primary key,
    email varchar(255) not null,
    username varchar(64) not null,
    password varchar(255) not null,
    created_at timestamp default current_timestamp
);
select * from users;
truncate table users;

drop table if exists comments;
create table comments(
	id int auto_increment primary key,
    message text not null,
    author varchar(64) not null,
    image blob default null,
    created_at timestamp default current_timestamp
);

drop table if exists categories;
create table categories(
	id int auto_increment primary key,
    name varchar(255) not null
);
insert into categories values (1, "zapatos");
insert into categories values (2, "mochilas");
insert into categories values (3, "carros");

select * from categories;
truncate table categories;

drop table if exists options;
create table options(
	id int auto_increment primary key,
    name text not null,
    category_id int not null,
    selected integer not null default 0,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

insert into options values (1, "nike", 1, 0);
insert into options values (2, "addidas", 1, 0);
insert into options values (3, "jansport", 2, 0);
insert into options values (4, "addidas", 2, 0);
insert into options values (5, "ferrari",3, 0);
insert into options values (6, "lamborghini",3, 0);

truncate table options;
select * from options;

drop table if exists surveys;
create table surveys(
	id int auto_increment primary key,
    name varchar(64) not null,
    created_at timestamp default current_timestamp
);
insert into surveys(id, name) values(1, "juan");
insert into surveys(id, name) values(2, "luis");
select * from surveys;

drop table if exists department;
create table department(
	id int auto_increment primary key,
    name varchar(64) not null,
    created_at timestamp default current_timestamp
);
insert into department(name) values ("calidad");
insert into department(name) values ("produccion");
select * from department;

drop table if exists suggestions;
create table suggestions(
	id  int auto_increment primary key,
    category_id int not null,
    option_id int not null,
    surveys_id int not null,
    department_id int not null,
    created_at timestamp default current_timestamp,
    
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (option_id) REFERENCES options(id),
    FOREIGN KEY (surveys_id) REFERENCES surveys(id)
);
insert into suggestions(category_id, option_id, surveys_id, department_id) values (1, 1, 1, 1);
insert into suggestions(category_id, option_id, surveys_id, department_id) values (1, 2, 1, 1);
insert into suggestions(category_id, option_id, surveys_id, department_id) values (2, 3, 1, 2);
insert into suggestions(category_id, option_id, surveys_id, department_id) values (2, 4, 2, 2);
insert into suggestions(category_id, option_id, surveys_id, department_id) values (3, 6, 2, 1);

SELECT DISTINCT(UPPER(O.NAME)) AS 'OPTIONS' FROM SUGGESTIONS AS S JOIN OPTIONS AS O ON S.OPTION_ID = O.ID JOIN CATEGORIES AS C ON S.CATEGORY_ID = C.ID WHERE S.CATEGORY_ID = 3;
