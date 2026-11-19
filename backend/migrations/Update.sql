
use api_flow;
select * from usuarios;
update usuarios set senha = "$2b$10$qFqLCV5XFbFemm/DpJu5YevqJfyGuBhccYy3JLY4j8wXv/n/I8MJy" where id = 4;

delete from usuarios where id = 104;

-- Atualizar o painel de maquinas com esse script no bd
ALTER TABLE api_flow.maquinas 
ADD COLUMN usuario_id INT NULL,
ADD CONSTRAINT fk_maquinas_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id);