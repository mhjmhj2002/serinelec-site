# Rastreabilidade de Conteúdo — Serinelec V1

Este documento registra a correspondência exata entre o acervo original da Serinelec (backup Joomla preservado em `.local/backup/www.serinelec.cl`) e as novas páginas em HTML5 estático puro da V1.

---

## 1. Mapeamento de Páginas

| Página V1 Estática | Fonte no Backup Original | Tema / Conteúdo Preservado | Status V1 |
| :--- | :--- | :--- | :--- |
| **`index.html`** | `index.html` e `index.php.html` | Apresentação institucional da Serinelec, carrossel de fotos reais de instalações e tableros, síntese dos 4 serviços principais, diferenciais técnicos e canais diretos de contato. | ✅ Concluído |
| **`proyectos-electricos.html`** | `index.php?option=com_content&view=article&id=102&Itemid=37.html` | Projetos em média e baixa tensão, regularização e certificação SEC, planos TE1/TE2, empalmes e aumento de capacidade. | ✅ Concluído |
| **`inspecciones.html`** | `index.php?option=com_content&view=article&id=101&Itemid=75.html` | Inspeção Técnica de Obras (ITO), auditorias de conformidade com normas chilenas (RIC / NCh Elec), relatórios de segurança e ensaios técnicos. | ✅ Concluído |
| **`gestion-produccion.html`** | `index.php?option=com_content&view=article&id=100&Itemid=109.html` | Gestão de produção industrial, fabricação de tableros elétricos, controle de qualidade e otimização de processos fabris. | ✅ Concluído |
| **`capacitaciones.html`** | `index.php?option=com_content&view=article&id=99&Itemid=88.html` | Treinamento técnico e capacitação para operadores, instaladores e mantenedores em segurança elétrica e operação industrial. | ✅ Concluído |
| **`contacto.html`** | `index.php?option=com_content&view=article&id=104&Itemid=140.html` | Informações de contato direto de Luis Carrasco (telefone, e-mail institucional, localização em Santiago/cobertura nacional) e formulário estático. | ✅ Concluído |

---

## 2. Acervo de Mídias e Fotografias

### Fotografias do Carrossel Hero
A composição original `servicios_home.jpg` (que continha 3 imagens unidas) foi desmembrada em fotografias individuais:
1. `assets/images/hero/hero-1-ingenieria.jpg` (e `.webp`): Tableros e montagens elétricas industriais.
2. `assets/images/hero/hero-2-inspecciones.jpg` (e `.webp`): Equipamentos de potência e inspeções técnicas.
3. `assets/images/hero/hero-3-proyectos.jpg` (e `.webp`): Infraestrutura elétrica e subestações industriais.

### Fotografias de Serviços
- `assets/images/services/proyectos-electricos.jpg`
- `assets/images/services/inspecciones.jpg`
- `assets/images/services/gestion-produccion.jpg`
- `assets/images/services/capacitaciones.jpg`

### Identidade Visual
- `assets/images/logo.png`: Logotipo original da Serinelec recuperado em alta definição.
- `favicon.ico`: Favicon institucional original.

---

## 3. Diretrizes de Fidelidade de Conteúdo
- **Nenhum dado inventado:** Foram mantidos os dados de contato oficiais (`+56 9 8568 0824`, `lcarrasco@serinelec.cl`), o escopo geográfico (Santiago, Região Metropolitana e cobertura nacional) e as especialidades técnicas reais.
- **Formulário de Contato:** Validação nativa no navegador sem simulação de envio falso, informando com clareza o estado de homologação da V1 e incentivando o contato direto por telefone ou e-mail.
- **Idiomas:** Configurado para espanhol do Chile (`es-CL`). Os seletores para inglês e português indicam explicitamente que estarão disponíveis futuramente, sem gerar links quebrados.
