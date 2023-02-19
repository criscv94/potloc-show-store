# frozen_string_literal: true

Rails.application.routes.draw do
  mount ActionCable.server => '/cable'
  resources :store_items, only: %i[index update]
  resources :stores, only: %i[index]
end
