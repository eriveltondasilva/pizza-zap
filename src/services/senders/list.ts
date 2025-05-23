import type { Whatsapp } from '@wppconnect-team/wppconnect'
import { injectable } from 'tsyringe'
import type { ISender } from '../../types/interfaces.js'
import type { ResponseContent, ResponseList } from '../../types/responses.js'

@injectable()
export class ListSenderService implements ISender {
  public async send(client: Whatsapp, phone: string, content: ResponseContent) {
    if (!content.text || !content.list?.length) throw new Error('Invalid list content')

    await client.sendListMessage(phone, {
      buttonText: 'Clique Aqui',
      description: `[BOT]\n${content.text}`,
      sections: this.createListSections(content.list),
    })
  }

  //#
  private createListSections(list: ResponseList[]) {
    const groupedRows = Object.groupBy(list, (row) => row.category)

    return Object.entries(groupedRows).map(([category, items]) => ({
      title: category.toUpperCase(),
      rows: items?.map(({ rowId, title, description }) => ({
        rowId,
        title,
        description,
      })),
    }))
  }
}
