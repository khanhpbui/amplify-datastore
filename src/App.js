
import React, { useState, useEffect } from 'react'
import { SketchPicker } from 'react-color'
import { Input, Button } from 'antd'
import { DataStore } from '@aws-amplify/datastore'
import { Message} from './models'

const initialState = { color: '#000000', title: '', }

function App() {
  const [formState, setFormState] = useState(initialState)
  const [messages, setMessages] = useState([])
  const [showPicker, setShowPicker] = useState(false)

  useEffect(() => { 
    fetchMessages()
    const subscription = DataStore.observe(Message).subscribe(() => fetchMessages())
    return () => subscription.unsubscribe()
  })

  function onChange(e) {
    if (e.hex) {
      setFormState({ ...formState, color: e.hex })
    } else { setFormState({ ...formState, title: e.target.value }) }
  }
  
  async function fetchMessages() {
    const messages = await DataStore.query(Message)
    setMessages(messages)
  }
  async function createMessage() {
    if (!formState.title) return
    await DataStore.save(new Message({ ...formState }))
    setFormState(initialState)
  }

    return (
      <div style={container}>
        <h1 style={heading}>Write A Note</h1>
        <Input
          onChange={onChange}
          name='title'
          placeholder='Write your message here'
          value={formState.title}
          style={input}
        />
        <div>
          <Button onClick={() => setShowPicker(!showPicker)}style={button}>Toggle Color Options</Button>
          <p>Color: <span style={{fontWeight: 'bold', color: formState.color}}>{formState.color}</span></p>
        </div>
        {
          showPicker && <SketchPicker color={formState.color} onChange={onChange} />
        }
        <Button type='primary' onClick={createMessage}>Create Message</Button>
        {
          messages.map(message => (
            <div key={message.id} style={{...messageStyle, backgroundColor: message.color}}>
              <div style={messageBg}>
                <p style={messageTitle}>{message.title}</p>
              </div>
            </div>
          ))
        }
      </div>
    )
}

const container = { width: '100%', padding: 40, maxWidth: 900 }
const input = { marginBottom: 10 }
const button = { marginBottom: 10 }
const heading = { fontWeight: 'normal', fontSize: 40 }
const messageBg = { backgroundColor: 'white' }
const messageStyle = { padding: '10px', marginTop: 7, borderRadius: 4 }
const messageTitle = { margin: 0, padding: 9, fontSize: 20  }

export default App

