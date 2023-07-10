const { createBookHandler, readAllBooksHandler, readBookByIdHandler, updateBookByIdHandler, deleteBookByIdHandler } = require('./handler')

const routes = [
  {
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return 'Ini adalah halaman Home'
    }
  },
  {
    method: '*',
    path: '/',
    handler: (request, h) => {
      return 'Halaman ini tidak dapat diakses dengan method tersebut!'
    }
  },
  {
    method: 'POST',
    path: '/books',
    handler: createBookHandler
  },
  {
    method: 'GET',
    path: '/books',
    handler: readAllBooksHandler
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: readBookByIdHandler
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: updateBookByIdHandler
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookByIdHandler
  }
]

module.exports = routes
