import type { Whatsapp } from '@wppconnect-team/wppconnect'
import { injectable } from 'tsyringe'

import type { ISender } from './types.js'

export type ResponseList = {
  rowId: string
  title: string
  description: string
  category: string
}

type ResponseContent = {
  text: string
  list: ResponseList[]
}

@injectable()
export class ListSenderService implements ISender {
  public async send(client: Whatsapp, phone: string, content: ResponseContent) {
    // if (!content.text || !content.list?.length) throw new Error('Invalid list content')

    await client.sendListMessage(phone, {
      buttonText: 'Click here',
      description: 'Choose one option',
      sections: [
        {
          title: 'Section 1',
          rows: [
            {
              rowId: 'my_custom_id',
              title: 'Test 1',
              description: 'Description 1',
            },
            {
              rowId: '2',
              title: 'Test 2',
              description: 'Description 2',
            },
          ],
        },
      ],
    })

    // await client.sendListMessage(phone, {
    //   buttonText: 'Clique Aqui',
    //   description: `[BOT]\n${content.text}`,
    //   sections: this.createListSections(content.list),
    // })
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
