import { InvalidArgumentError,NotFoundError } from '@/exceptions';

export default function errAxiosRes(err) {
  if (err instanceof NotFoundError) {
    return { err: "This request doesn't exist."}
  }
  if (err instanceof InvalidArgumentError) {
    return { err: err.message }
  }

  return { err: 'something went wrong, please try again later !' }
}
