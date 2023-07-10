const bookshelf = require('./bookshelf')
const { nanoid } = require('nanoid')

const createBookHandler = async (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  try {
    const id = nanoid(16)

    if (!name || name === '') {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku'
      })
      response.code(400)
      return response
    }

    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
      })
      response.code(400)
      return response
    }

    const ifFinished = (readPage, pageCount) => {
      if (readPage === pageCount) {
        return true
      } else if (pageCount > readPage) {
        return false
      }
    }

    const finished = ifFinished(readPage, pageCount)
    const insertedAt = new Date().toISOString()
    const updatedAt = insertedAt

    const newBook = {
      id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
    }

    bookshelf.push(newBook)

    const isSuccess = bookshelf.filter((book) => book.id === id).length > 0

    if (isSuccess) {
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id
        }
      })

      response.code(201)
      return response
    }
  } catch (error) {
    const response = h.response({
      status: 'error',
      message: 'Buku gagal ditambahkan'
    })

    response.code(500)
    return response
  }
}

const readAllBooksHandler = async (request, h) => {
  try {
    const { name: queryName, reading, finished } = request.query

    let datas = bookshelf

    if (queryName !== undefined) {
      datas = datas.filter((book) => book.name.toLowerCase().includes(queryName.toLowerCase()))
    }
    if (reading !== undefined) {
      datas = datas.filter((book) => book.reading === !!Number(reading))
    }
    if (finished !== undefined) {
      datas = datas.filter((book) => book.finished === !!Number(finished))
    }

    const response = h.response({
      status: 'success',
      data: {
        books: datas.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        }))
      }
    })
    response.code(200)
    return response
  } catch (error) {
    const response = h.response({
      status: 'error',
      message: 'Gagal mendapatkan daftar buku'
    })
    response.code(500)
    return response
  }
}

const readBookByIdHandler = async (request, h) => {
  try {
    const { bookId } = request.params

    const book = bookshelf.filter((book) => book.id === bookId)[0]

    if (book !== undefined) {
      const response = h.response({
        status: 'success',
        data: {
          book
        }
      })

      response.code(200)
      return response
    }

    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan'
    })

    response.code(404)
    return response
  } catch (error) {
    const response = h.response({
      status: 'error',
      message: 'Buku tidak ditemukan'
    })

    response.code(500)
    return response
  }
}

const updateBookByIdHandler = async (request, h) => {
  try {
    const { bookId } = request.params

    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

    const updatedAt = new Date().toISOString()

    const index = bookshelf.findIndex((book) => book.id === bookId)

    if (index !== -1) {
      if (!name || name === '') {
        const response = h.response({
          status: 'fail',
          message: 'Gagal memperbarui buku. Mohon isi nama buku'
        })
        response.code(400)
        return response
      }

      if (readPage > pageCount) {
        const response = h.response({
          status: 'fail',
          message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        })
        response.code(400)
        return response
      }

      const ifFinished = (readPage, pageCount) => {
        if (readPage === pageCount) {
          return true
        } else if (pageCount > readPage) {
          return false
        }
      }

      const finished = ifFinished(readPage, pageCount)

      bookshelf[index] = {
        ...bookshelf[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        updatedAt
      }

      const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui'
      })

      response.code(200)
      return response
    }

    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan'
    })

    response.code(404)
    return response
  } catch (error) {
    const response = h.response({
      status: 'error',
      message: 'Buku gagal diperbarui'
    })

    response.code(500)
    return response
  }
}

const deleteBookByIdHandler = async (request, h) => {
  try {
    const { bookId } = request.params

    const index = bookshelf.findIndex((book) => book.id === bookId)

    if (index !== -1) {
      bookshelf.splice(index, 1)

      const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus'
      })

      response.code(200)
      return response
    }

    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan'
    })

    response.code(404)
    return response
  } catch (error) {
    const response = h.response({
      status: 'error',
      message: 'Buku gagal dihapus'
    })

    response.code(500)
    return response
  }
}

module.exports = { createBookHandler, readAllBooksHandler, readBookByIdHandler, updateBookByIdHandler, deleteBookByIdHandler }
