"use client";

export default function EmployeeForm({ onCreate }) {
  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    onCreate({
      id: crypto.randomUUID(),
      name: formData.get("name").trim(),
      email: formData.get("email").trim(),
      role: formData.get("role"),
      shift: formData.get("shift"),
    });

    event.currentTarget.reset();
  }

  return (
    <section className="panel employee-form-panel" aria-labelledby="employee-form-title">
      <div className="panel-heading">
        <div>
          <h2 id="employee-form-title">Novo funcionário</h2>
          <p>Preencha os dados para adicionar à equipe.</p>
        </div>
      </div>

      <form className="employee-form" onSubmit={handleSubmit}>
        <label>
          Nome completo
          <input
            autoComplete="name"
            maxLength={100}
            name="name"
            placeholder="Ex.: Ana Costa"
            required
          />
        </label>
        <label>
          E-mail
          <input
            autoComplete="email"
            maxLength={150}
            name="email"
            placeholder="nome@empresa.com"
            required
            type="email"
          />
        </label>
        <label>
          Cargo
          <input
            maxLength={80}
            name="role"
            placeholder="Ex.: Operador de máquinas"
            required
          />
        </label>
        <label>
          Turno
          <select defaultValue="" name="shift" required>
            <option disabled value="">Selecione um turno</option>
            <option value="Manhã">Manhã</option>
            <option value="Tarde">Tarde</option>
            <option value="Noite">Noite</option>
            <option value="Administrativo">Administrativo</option>
          </select>
        </label>
        <button className="button button-primary" type="submit">
          Cadastrar funcionário
        </button>
      </form>
    </section>
  );
}
