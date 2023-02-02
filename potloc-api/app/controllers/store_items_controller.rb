class StoreItemsController < ApplicationController
  def index
    @store_items = StoreItem.joins(:item).all
    render json: StoreItemSerializer.new(@store_items), status: 200
  end
end
