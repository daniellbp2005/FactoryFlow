
use api_flow;
select * from usuarios;
update usuarios set senha = "$2b$10$Xkqa1x95GgwK55ly8sSIw.SWmQv44jFp58j60.6fWTU3Rvxot.Zde" where id = 4;

delete from usuarios where id = 104;

-- Atualizar o painel de maquinas com esse script no bd
ALTER TABLE api_flow.maquinas 
ADD COLUMN usuario_id INT NULL,
ADD CONSTRAINT fk_maquinas_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id);