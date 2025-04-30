# End-to-End Testing
1. Install pnpm: Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression
2. Install playwright: pnpm create playwright
3. Record test: pnpm exec playwright codegen <URL> (--viewport-size=375,667 for mobile view)
4. Execute test: pnpm exec playwright test --ui
5. Enjoy