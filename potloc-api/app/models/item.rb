class Item < ApplicationRecord
  validates :name, presence: true, uniqueness: { case_sensitive: false }
  has_many :store_items, dependent: :destroy
  has_many :stores, through: :store_items
end
