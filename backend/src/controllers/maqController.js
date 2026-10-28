import * as MaquinasService from "../services/maquinaService.js"

function responderErro(erro, res, next) {
    if (erro instanceof TypeError) {
        return res.status(400).json({ sucesso: false, erro: erro.message });
    }
    if (erro.message.includes('não encontrado')) {
        return res.status(404).json({ sucesso: false, erro: erro.message });
    }
    return next(erro);
}

export async function listar(req, res, next) {
    try {
        const resultado = await MaquinasService.listar(req.query);
        return res.status(200).json({
            sucesso: true,
            dados: resultado.produtos,
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

