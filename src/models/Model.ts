import { AxiosPromise, AxiosResponse } from 'axios'

interface ModelAttributes<T> {
  set(value: T): void;
  getAll(): T;
  get<K extends keyof T>(key: K): T[K]
}

interface Sync<T> {
  fetch(id: number): AxiosPromise;
  save(data: T): AxiosPromise;
}

interface Events {
  on(eventName: string, callback: () => void): void;
  trigger(eventName: string): void
}

interface hasID { //// THIS EXTENDS THE GENERIC TYPE T AS A TYPE CONSTRAINT SO THAT TYPESCRIPT KNOWS THAT THE TYPE T WILL HAVE ID PROPERTY
  id?: number
}

export class Model<T extends hasID> {
  constructor(
    private attributes: ModelAttributes<T>,
    private events: Events,
    private sync: Sync<T>
  ){}

  // USING ACCESSORS TO REFERENCE METHODS
  get on() {
    return this.events.on;
  }

  get trigger() {
    return this.events.trigger;
  }

  get get() {
    return this.attributes.get;
  }

  set(update: T ): void {
    this.attributes.set(update)
    this.events.trigger('change')
  }

  fetch(): void {
    const id = this.attributes.get('id')

    if(typeof id !== 'number'){
      throw new Error('Cannot fetch without an id')
    }

    this.sync.fetch(id).then((response: AxiosResponse): void => {
      this.set(response.data)
    })
  }

  save(): void {
    this.sync.save(this.attributes.getAll()).then((response: AxiosResponse): void => {
      this.trigger('save')
    }).catch(() => {
      this.trigger('error')
    })
  }
}