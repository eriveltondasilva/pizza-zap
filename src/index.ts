import { type Whatsapp, create } from '@wppconnect-team/wppconnect'

create({
  phoneNumber: '5582999723607',
  disableWelcome: true,
})
  .then((client) => start(client))
  .catch((error) => console.log(error))

function start(client: Whatsapp) {
  client.onAnyMessage((message) => {
    if (message.body === 'Hello') {
      client
        .sendListMessage(message.from, {
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
        .then((result) => {
          console.log('Result: ', result)
        })
        .catch((erro) => {
          console.error('Error when sending: ', erro)
        })
    }
  })
}
