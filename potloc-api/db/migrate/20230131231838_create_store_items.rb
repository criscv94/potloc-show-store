class CreateStoreItems < ActiveRecord::Migration[7.0]
  def change
    create_table :store_items do |t|
      t.integer :inventory
      t.references :store, null: false, foreign_key: true
      t.references :item, null: false, foreign_key: true

      t.timestamps
    end
  end
end
