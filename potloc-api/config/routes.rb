Rails.application.routes.draw do
  resources :store_items, only: %i[index]
  resources :stores, only: %i[index]
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
