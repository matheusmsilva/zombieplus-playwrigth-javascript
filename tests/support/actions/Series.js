const { expect } = require('../../support');

export class Series {

    constructor(page) {
        this.page = page
    }

    async go() {
        await this.page.locator('a[href$="tvshows"]').click()
    }

    async goToForm() {
        await this.page.locator('a[href$="register"]').click()
    }

    async submit() {
        await this.page.getByRole('button', { name: 'Cadastrar ' }).click()
    }

    async create(serie) {
        await this.goToForm()
        await this.page.getByLabel('Titulo da série').fill(serie.title)
        await this.page.getByLabel('Sinopse').fill(serie.overview)

        await this.page.locator('#select_company_id .react-select__indicator').click()
        await this.page.locator('.react-select__option')
            .filter({ hasText: serie.company })
            .click()

        await this.page.locator('#select_year .react-select__indicator').click()
        await this.page.locator('.react-select__option')
            .filter({ hasText: serie.release_year })
            .click()

        await this.page.locator('input[name=seasons]')
            .fill(`${serie.season}`)

        await this.page.locator('input[name=cover]')
            .setInputFiles('tests/support/fixtures' + serie.cover)

        if (serie.featured) {
            await this.page.locator('.featured .react-switch').click()
        }

        await this.submit()
    }

    async search(target) {
        await this.page.getByPlaceholder('Busque pelo nome')
            .fill(target)

        await this.page.click('.actions button')
    }

    async tableHaveContent(content) {
        const contentList = Array.isArray(content) ? content : [content]
        for (const c of contentList) {
            const row = await this.page.locator(`//td[text()="${c}"]`)
            await expect(row).toBeVisible()
        }
    }

    async alertHaveText(target) {
        await expect(this.page.locator('.alert')).toHaveText(target)
    }

    async remove(title) {
        await this.page.getByRole('row', { name: title }).getByRole('button').click()
        await this.page.click('.confirm-removal')
    }
}