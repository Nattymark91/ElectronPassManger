import { PassType } from '@prisma/client'

export enum MenuComponentsEnum {
  ADD = 'add',
  WORK = 'work',
  PERSONAL = 'personal'
}

export type MenuComponent =
  | MenuComponentsEnum.ADD
  | MenuComponentsEnum.WORK
  | MenuComponentsEnum.PERSONAL

export interface Passwords {
  id: number
  name: string
  user: string
  pass: string
  type: PassType
}

export type CreatePass = Omit<Passwords, 'id'>
