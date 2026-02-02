# Baoba – Manual de Fluxo de Trabalho

Guia rápido para editar, compilar e publicar alterações no projeto.

---

## Passo a passo completo

### 1. Faça a alteração desejada
- Edite os arquivos em `src/` (SCSS ou JavaScript)
- Exemplos: `src/scss/_header.scss`, `src/js/dropdown-desktop.js`

### 2. Salve o arquivo
- `Cmd + S` (Mac) ou `Ctrl + S` (Windows)

### 3. Execute o build
```bash
npx gulp build
```

### 4. Adicione as alterações ao Git
```bash
git add .
```

### 5. Crie o commit
```bash
git commit -m "Descrição da alteração"
```
*Exemplo: `git commit -m "Atualiza estilos do header"`*

### 6. Envie para o GitHub
```bash
git push origin main
```

### 7. Aguarde
- **1 a 2 minutos** – o jsDelivr atualiza o cache automaticamente
- Recarregue o site para ver as alterações

---

## Resumo (comandos em sequência)

```bash
npx gulp build
git add .
git commit -m "Sua mensagem aqui"
git push origin main
```

---

## Estrutura de arquivos

| Onde editar        | O que gera          |
|--------------------|---------------------|
| `src/scss/*.scss`  | `dist/css/main.css` |
| `src/js/*.js`      | `dist/js/bundle.js` |

---

## Links usados no Webflow

**Footer Code:**
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/uwex-design/baoba@main/dist/css/main.css">
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/uwex-design/baoba@main/dist/js/bundle.js"></script>
```

---

## Comandos extras (opcional)

| Comando             | Função                             |
|---------------------|------------------------------------|
| `npx gulp watch`    | Observa mudanças e recompila       |
| `npm run watch`     | Mesmo que `npx gulp watch`         |
| `npx gulp dev`      | Build + watch para desenvolvimento |
| `npm run build`     | Mesmo que `npx gulp build`         |

---

## Solução de problemas

**Push rejeitado?**
```bash
git pull origin main
git push origin main
```

**CSS não atualizou no site?**
- Confirme que rodou `npx gulp build` após editar
- Aguarde 2 minutos após o push (cache do jsDelivr)
