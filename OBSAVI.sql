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

drop table if exists comments;
create table comments(
	id int auto_increment primary key,
    message text not null,
    author varchar(64) not null,
    created_at timestamp default current_timestamp
);

drop table if exists categories;
create table categories(
	id int auto_increment primary key,
    name varchar(255) not null
);

drop table if exists options;
create table options(
	id int auto_increment primary key,
    name text not null,
    category_id int not null,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

drop table if exists surveys;
create table surveys(
	id int auto_increment primary key,
    name varchar(64) not null,
    created_at timestamp default current_timestamp
);

drop table if exists suggestions;
create table suggestions(
	id  int auto_increment primary key,
    category_id int not null,
    option_id int not null,
    surveys_id int not null,
    created_at timestamp default current_timestamp,
    
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (option_id) REFERENCES options(id),
    FOREIGN KEY (surveys_id) REFERENCES surveys(id)
);

