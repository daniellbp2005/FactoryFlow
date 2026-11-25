import * as MaquinasService from "../services/maquinaService.js"

function responderErro(erro, res, next) {
    if (erro instanceof TypeError) {
        return res.status(400).json({ sucesso: false, erro: erro.message });
    }
    if (erro.message && erro.message.includes('não encontrado')) {
        return res.status(404).json({ sucesso: false, erro: erro.message });
    }
    return next(erro);
}

// Listar máquinas. Operadores veem apenas as não associadas.
export async function listar(req, res, next) {
    try {
        const resultado = await MaquinasService.listar(req.query);
        let produtos = resultado.produtos;
        if (req.usuario && req.usuario.perfil !== 'administrador') {
            produtos = produtos.filter(p => !p.usuario_id);
        }
        return res.status(200).json({
            sucesso: true,
            dados: produtos,
            paginacao: resultado.paginacao
        });
    } catch (erro) {
        return responderErro(erro, res, next);
    }
}

export async function buscarPorId(req, res, next) {
    try {
        const produto = await MaquinasService.buscarPorId(req.params.id);
        return res.status(200).json({ sucesso: true, dados: produto });
    } catch (erro) {
        return responderErro(erro, res, next);
    }
}

export async function criar(req, res, next) {
    try {
        const produto = await MaquinasService.criar(req.body);
        return res.status(201).json({ sucesso: true, dados: produto });
    } catch (erro) {
        return responderErro(erro, res, next);
    }
}

export async function atualizar(req, res, next) {
    try {
        const produto = await MaquinasService.atualizar(req.params.id, req.body);
        return res.status(200).json({ sucesso: true, dados: produto });
    } catch (erro) {
        return responderErro(erro, res, next);
    }
}

export async function excluir(req, res, next) {
    try {
        await MaquinasService.excluir(req.params.id);
        return res.status(204).send();
    } catch (erro) {
        return responderErro(erro, res, next);
    }
}

// Novo endpoint: operador solicita atribuição da máquina a ele próprio
export async function atribuir(req, res, next) {
    try {
        if (!req.usuario) {
            throw Object.assign(new Error('Autenticação necessária.'), { status: 401 });
        }
        const id = req.params.id;
        const usuarioId = req.usuario.id;
        const produto = await MaquinasService.atribuir(id, usuarioId);
        return res.status(200).json({ sucesso: true, dados: produto });
    } catch (erro) {
        return responderErro(erro, res, next);
    }
}
