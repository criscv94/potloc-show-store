class Store < ApplicationRecord
  validates :name, presence: true, uniqueness: { case_sensitive: false }
  has_many :store_items, dependent: :destroy
  has_many :items, through: :store_items
end
