# AGENTS.md — Regras de Implementação | Site Serinelec


## 1. Leitura obrigatória antes de qualquer tarefa
1. Leia integralmente este AGENTS.md.
2. Leia o README.md da raiz do projeto: /home/mhj/git/serinelec-site/README.md.
3. Leia a tarefa específica em Google Drive > Site Serinelec > tasks.
4. Consulte ANDAMENTO_MELHORIAS no Drive para identificar prioridades, dependências e estado real.
5. Antes de modificar qualquer arquivo, examine o estado atual do repositório e as alterações não commitadas. Não suponha que o estado do GitHub e o diretório local estejam idênticos.


Este documento rege a execução. Quando uma task antiga recomendar commit, push ou trocar de branch, esta regra mais recente prevalece.


## 2. Regras inegociáveis de Git
- Trabalhe EXCLUSIVAMENTE na branch que estiver ativa ao iniciar a tarefa.
- NÃO execute git commit, git push, git merge, git rebase, git checkout, git switch nem crie outras branches/tags. NÃO altere nem publique refs remotas.
- NÃO use git reset --hard, git clean, git restore ou outra operação destrutiva para descartar alterações do usuário.
- É permitido usar git status, git diff, git log e demais consultas não destrutivas.
- Deixe as alterações locais para revisão do Owner. Relate arquivos modificados e sugira uma mensagem de commit; o Owner decide quando versionar e publicar.
- NÃO acione manualmente GitHub Actions, deploy ou publicação. Não altere o site em produção.
- Se qualquer instrução anterior contrariar estas regras, NÃO a execute e registre a divergência.


## 3. Arquitetura do projeto
- Website institucional estático: HTML5, CSS3, JavaScript Vanilla (ES6+), imagens e recursos locais.
- NÃO introduzir Node.js, npm, pnpm, Vite, Next.js, React, frameworks ou processos de build.
- Exceção delimitada: TASK-001 pode criar um endpoint PHP mínimo SOMENTE para o envio do formulário de contato; o frontend permanece estático. Sem banco de dados ou backend geral.
- Reaproveite a estrutura e componentes existentes; mudanças incrementais, simples, legíveis e documentadas.
- Preserve os fatos e identidade da empresa. Idioma original es-CL; pt-BR e EN somente nas tasks autorizadas. Não invente serviços, clientes, certificações ou ofertas de orçamento gratuito.
- Não assuma que a versão portuguesa ou inglesa já está implementada; respeite a ordem/dependências das tasks.


## 4. Segurança e ambientes
- Caminho do projeto: /home/mhj/git/serinelec-site
- Backup original: /home/mhj/git/serinelec-site/.local/backup — SOMENTE LEITURA.
- Homologação: https://preview.serinelec.cl/ — não publicar automaticamente sem autorização.
- Produção: https://serinelec.cl/ — NUNCA alterar sem ordem explícita.
- NÃO copiar, versionar ou exibir em logs tokens, chaves, senhas, .env, backups ou dados sensíveis. Não editar Secrets do GitHub ou DNS/SSL/cPanel por iniciativa própria.
- Não enviar dados reais de contato/e-mail em testes sem autorização e destinatário confirmado.
- Não modificar o workflow .github/workflows/deploy-preview.yml fora da necessidade expressa da task; jamais disparar deploy por conta própria.


## 5. Economia de tokens e verificação
- Proibido usar/instalar Playwright, Cypress, Puppeteer, Selenium, navegador automatizado, screenshots automatizados e suítes E2E.
- NÃO instalar dependências ou executar testes pesados. Verificações pontuais e estáticas são permitidas (links/arquivos, sintaxe JS quando viável sem Node, php -l para endpoint PHP se disponível).
- Não declarar testes visuais ou homologação como concluídos sem validação do Owner.
- Evitar refatorações fora do escopo, investigações intermináveis e relatórios longos.
- Se houver dúvida material de segurança, destinatário de e-mail, produção ou requisito, pare e registre a pendência em vez de inventar.


## 6. Execução, continuidade e entrega
1. Confirme task, branch atual, estado do Git e leitura do README.
2. Ao assumir uma task `TO-DO`, atualize imediatamente o registro de acompanhamento para `DOING` (ou `DOING — BLOCKED` quando já houver impedimento externo), registrando data de início e o estado real. Se o acompanhamento não estiver gravável, informe isso antes de modificar o código.
3. Implemente somente a melhoria solicitada, respeitando as dependências e reaproveitando o trabalho válido.
4. Faça as verificações mínimas pertinentes sem deploy.
5. Ao terminar o desenvolvimento local previsto no escopo, atualize a task para `DEVELOPED`, mesmo que a homologação, deploy ou revisão do Owner ainda estejam pendentes. `DEVELOPED` nunca deve ser usado para mascarar pendências de implementação.
6. Use `DONE` somente após a homologação/aceite exigido do Owner. Não deixe uma task em `DOING` quando o desenvolvimento local dela já estiver finalizado.
7. Entregue resumo curto: o que mudou, arquivos modificados, verificações efetivas, pendências e mensagem de commit sugerida.
8. NÃO efetue commit, push, merge, troca de branch ou publicação.


## 7. Ordem de precedência
Segurança, restrições explícitas atuais do Owner e AGENTS.md prevalecem sobre comandos operacionais antigos em tasks e README. README.md define as convenções técnicas do projeto; as tasks definem o escopo funcional. Conflitos devem ser informados antes de executar ações irreversíveis.
